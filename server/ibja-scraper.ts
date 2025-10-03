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
    console.log('===== Fetching fresh IBJA rates... =====');
    const response = await fetch('https://ibja.co/');
    console.log('Fetch response status:', response.status);
    const html = await response.text();
    console.log('HTML length:', html.length);
    const $ = cheerio.load(html);

    // Initialize rates with default values
    let gold24kPerGram = 0;
    let gold22kPerGram = 0;
    let silverPerKg = 0;

    // Try to find rates in the HTML text
    const pageText = $('body').text();
    
    // Log a snippet of the page text for debugging
    const snippet = pageText.substring(0, 5000);
    console.log('Page text snippet length:', pageText.length);
    
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
    
    // Try to find silver price - IBJA does not typically show silver rates
    // Look for silver price in a specific format (similar to gold rates)
    // Only match if ₹ is within 20 characters of "Silver" to avoid false matches
    const silverMatch = pageText.match(/Silver[\s\(\)0-9]{0,20}[:\s]*₹\s*([\d,]+)/i);
    if (silverMatch && silverMatch[1]) {
      const value = parseInt(silverMatch[1].replace(/,/g, ''));
      // If value seems like per gram (< 1000), multiply by 1000 for kg
      silverPerKg = value < 1000 ? value * 1000 : value;
      console.log('Found Silver rate:', silverPerKg);
    } else {
      console.log('Silver rate not available on IBJA website');
      // IBJA does not publish silver rates - leave as 0 to show "Not Available"
    }

    // Calculate per 10g for gold
    const gold24kPer10g = gold24kPerGram * 10;
    const gold22kPer10g = gold22kPerGram * 10;

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

    console.log('IBJA rates fetched successfully:', rates);
    return rates;

  } catch (error) {
    console.error('Error fetching IBJA rates:', error);
    
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
