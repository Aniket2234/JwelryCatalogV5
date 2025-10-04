import * as cheerio from 'cheerio';

interface RatesData {
  gold_24k: string;
  gold_22k: string;
  silver: string;
  lastUpdated: Date;
  isCached: boolean;
  cacheAge?: number; // in minutes
}

let cachedRates: RatesData | null = null;
let lastFetch: Date | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function fetchSilverRateFromMoneycontrol(): Promise<number> {
  try {
    console.log('Fetching silver rates from Moneycontrol...');
    const response = await fetch('https://www.moneycontrol.com/news/silver-rates-today/');
    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for the silver rate in the page
    const pageText = $('body').text();
    
    // Try to find the main silver rate display - usually shows per kg
    // Pattern: "SILVER RATE TODAY" followed by price, which is typically per kg
    // The format is: "SILVER RATE TODAY ₹ 165,000 2.48%"
    const silverRateMatch = pageText.match(/SILVER\s+RATE\s+TODAY[^\d]*?₹\s*([\d,]+)/i);
    
    if (silverRateMatch && silverRateMatch[1]) {
      const ratePerKg = parseInt(silverRateMatch[1].replace(/,/g, ''));
      // The main display shows per kg (typically 150,000-170,000 range)
      if (ratePerKg > 10000) { // Sanity check - per kg should be > 10,000
        console.log('Found silver rate from Moneycontrol:', ratePerKg, 'per kg');
        return ratePerKg;
      }
    }

    // Alternative: Look for the table with "1 Kg" and the corresponding price
    // This is more reliable as it's in a structured table
    const tableMatch = pageText.match(/1\s+Kg[^₹]*₹\s*([\d,]+)/i);
    
    if (tableMatch && tableMatch[1]) {
      const ratePerKg = parseInt(tableMatch[1].replace(/,/g, ''));
      console.log('Found silver rate per kg from table:', ratePerKg);
      return ratePerKg;
    }

    // Try another pattern: Look in the rate comparison table
    // "1 Gram ₹ 165" then multiply by 1000
    const gramMatch = pageText.match(/1\s+Gram[^₹]*₹\s*([\d,]+)/i);
    
    if (gramMatch && gramMatch[1]) {
      const ratePerGram = parseInt(gramMatch[1].replace(/,/g, ''));
      const ratePerKg = ratePerGram * 1000;
      console.log('Found silver rate per gram from table:', ratePerGram, '→ per kg:', ratePerKg);
      return ratePerKg;
    }

    console.log('Could not find silver rate on Moneycontrol');
    return 0;
  } catch (error) {
    console.error('Error fetching silver rates from Moneycontrol:', error);
    return 0;
  }
}

export async function fetchIBJARates(): Promise<RatesData> {
  // Return cached data if it's less than 1 hour old
  if (cachedRates && lastFetch && (Date.now() - lastFetch.getTime() < CACHE_DURATION)) {
    const cacheAge = Math.floor((Date.now() - lastFetch.getTime()) / 1000 / 60);
    console.log('Returning cached rates, cache age:', cacheAge, 'minutes');
    return {
      ...cachedRates,
      isCached: true,
      cacheAge
    };
  }

  try {
    console.log('===== Fetching fresh rates... =====');
    
    // Fetch gold rates from IBJA
    const ibjaResponse = await fetch('https://ibja.co/');
    console.log('IBJA fetch response status:', ibjaResponse.status);
    const ibjaHtml = await ibjaResponse.text();
    console.log('IBJA HTML length:', ibjaHtml.length);
    const $ = cheerio.load(ibjaHtml);

    // Initialize rates with default values
    let gold24kPerGram = 0;
    let gold22kPerGram = 0;

    // Try to find rates in the HTML text
    const pageText = $('body').text();
    
    // Log a snippet of the page text for debugging
    console.log('IBJA page text snippet length:', pageText.length);
    
    // Look for the rates section specifically
    const ratesSection = pageText.match(/IBJA'?s? indicative[^]*?(?=\n\n|\*|$)/i);
    if (ratesSection) {
      console.log('Found rates section:', ratesSection[0].substring(0, 500));
    }
    
    // Match "Fine Gold (999): ₹ 11733" pattern - try multiple patterns
    let gold999Match = pageText.match(/Fine Gold \(999\)[:\s]*₹\s*([\d,]+)/i);
    if (!gold999Match) {
      gold999Match = pageText.match(/Fine Gold[^₹]*₹\s*([\d,]+)/i);
    }
    if (gold999Match && gold999Match[1]) {
      gold24kPerGram = parseInt(gold999Match[1].replace(/,/g, ''));
      console.log('Found Fine Gold (999):', gold24kPerGram);
    } else {
      console.log('Could not find Fine Gold (999) in page');
    }
    
    // Match "22 KT: ₹ 11452" pattern
    let gold22Match = pageText.match(/22 KT[:\s]*₹\s*([\d,]+)/i);
    if (!gold22Match) {
      gold22Match = pageText.match(/22\s*KT[^₹]*₹\s*([\d,]+)/i);
    }
    if (gold22Match && gold22Match[1]) {
      gold22kPerGram = parseInt(gold22Match[1].replace(/,/g, ''));
      console.log('Found 22 KT:', gold22kPerGram);
    } else {
      console.log('Could not find 22 KT in page');
    }

    // Calculate per 10g for gold
    const gold24kPer10g = gold24kPerGram * 10;
    const gold22kPer10g = gold22kPerGram * 10;

    // Fetch silver rates from Moneycontrol
    const silverPerKg = await fetchSilverRateFromMoneycontrol();

    console.log('Scraped values:', {
      gold24kPerGram,
      gold22kPerGram,
      silverPerKg,
      gold24kPer10g,
      gold22kPer10g
    });

    // Format the response
    const rates: RatesData = {
      gold_24k: gold24kPer10g > 0 ? `₹ ${gold24kPer10g.toLocaleString('en-IN')}` : 'N/A',
      gold_22k: gold22kPer10g > 0 ? `₹ ${gold22kPer10g.toLocaleString('en-IN')}` : 'N/A',
      silver: silverPerKg > 0 ? `₹ ${silverPerKg.toLocaleString('en-IN')}` : 'N/A',
      lastUpdated: new Date(),
      isCached: false,
      cacheAge: 0
    };

    // Cache the results
    cachedRates = rates;
    lastFetch = new Date();

    console.log('Rates fetched successfully:', rates);
    return rates;

  } catch (error) {
    console.error('Error fetching rates:', error);
    
    // Return cached data if available, even if expired, with cache metadata
    if (cachedRates && lastFetch) {
      const cacheAge = Math.floor((Date.now() - lastFetch.getTime()) / 1000 / 60);
      console.log('Returning expired cached rates due to error, cache age:', cacheAge, 'minutes');
      return {
        ...cachedRates,
        isCached: true,
        cacheAge
      };
    }
    
    // Return error state if no cache available
    return {
      gold_24k: 'Error',
      gold_22k: 'Error',
      silver: 'Error',
      lastUpdated: new Date(),
      isCached: false,
      cacheAge: 0
    };
  }
}

// Force refresh the cache
export async function refreshRates(): Promise<RatesData> {
  cachedRates = null;
  lastFetch = null;
  return await fetchIBJARates();
}
