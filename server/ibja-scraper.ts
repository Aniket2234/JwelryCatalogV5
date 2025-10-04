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

async function fetchGoldRatesFromMoneycontrol(): Promise<{ gold24k: number; gold22k: number }> {
  try {
    console.log('Fetching gold rates from Moneycontrol...');
    const response = await fetch('https://www.moneycontrol.com/news/gold-rates-today/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const pageText = $('body').text();
    
    // Look for "GOLD RATE TODAY ₹ 115,400" - this is 24K per 10 grams
    const gold24kMatch = pageText.match(/GOLD\s+RATE\s+TODAY[^\d]*?₹\s*([\d,]+)/i);
    
    let gold24kPer10g = 0;
    let gold22kPer10g = 0;
    
    if (gold24kMatch && gold24kMatch[1]) {
      gold24kPer10g = parseInt(gold24kMatch[1].replace(/,/g, ''));
      if (gold24kPer10g > 10000 && gold24kPer10g < 200000) { // Sanity check
        console.log('Found 24K gold rate from Moneycontrol:', gold24kPer10g, 'per 10g');
      } else {
        gold24kPer10g = 0;
      }
    }

    // Look for 22K in the table: "10 Gram ₹ 109,900"
    // Pattern: Look for the "22 Carat Gold Rate" section with "10 Gram" specifically
    // Use more specific regex to avoid matching 1 Gram price
    const gold22kTableMatch = pageText.match(/22\s+Carat[^\d]*10\s+Gram[^\d]*₹\s*([\d,]+)/i);
    
    if (gold22kTableMatch && gold22kTableMatch[1]) {
      const rate = parseInt(gold22kTableMatch[1].replace(/,/g, ''));
      // Sanity check: 22K 10g should be around 100,000-120,000
      if (rate > 50000 && rate < 150000) {
        gold22kPer10g = rate;
        console.log('Found 22K gold rate from table:', gold22kPer10g, 'per 10g');
      }
    }
    
    // If the above didn't work, try a different pattern
    if (gold22kPer10g === 0) {
      // Look for the table structure more broadly
      const tableSection = pageText.match(/22\s+Carat\s+Gold\s+Rate[^]*?10\s+Gram[^\d]*₹\s*([\d,]+)/i);
      if (tableSection && tableSection[1]) {
        const rate = parseInt(tableSection[1].replace(/,/g, ''));
        if (rate > 50000 && rate < 150000) {
          gold22kPer10g = rate;
          console.log('Found 22K gold rate from alternative pattern:', gold22kPer10g, 'per 10g');
        }
      }
    }

    return { gold24k: gold24kPer10g, gold22k: gold22kPer10g };
  } catch (error) {
    console.error('Error fetching gold rates from Moneycontrol:', error);
    return { gold24k: 0, gold22k: 0 };
  }
}

async function fetchSilverRateFromMoneycontrol(): Promise<number> {
  try {
    console.log('Fetching silver rates from Moneycontrol...');
    const response = await fetch('https://www.moneycontrol.com/news/silver-rates-today/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const pageText = $('body').text();
    
    // Try to find the main silver rate display per kg
    const silverRateMatch = pageText.match(/SILVER\s+RATE\s+TODAY[^\d]*?₹\s*([\d,]+)/i);
    
    if (silverRateMatch && silverRateMatch[1]) {
      const ratePerKg = parseInt(silverRateMatch[1].replace(/,/g, ''));
      if (ratePerKg > 10000) { // Sanity check - per kg should be > 10,000
        const ratePer10g = Math.round(ratePerKg / 100); // Convert kg to 10g
        console.log('Found silver rate from Moneycontrol:', ratePerKg, 'per kg →', ratePer10g, 'per 10g');
        return ratePer10g;
      }
    }

    // Alternative: Look for "10 grams" in the table
    const silver10gMatch = pageText.match(/10\s+[Gg]rams?[^₹]*₹\s*([\d,]+)/i);
    
    if (silver10gMatch && silver10gMatch[1]) {
      const ratePer10g = parseInt(silver10gMatch[1].replace(/,/g, ''));
      console.log('Found silver rate per 10g from table:', ratePer10g);
      return ratePer10g;
    }

    // Try per gram and multiply by 10
    const gramMatch = pageText.match(/1\s+Gram[^₹]*₹\s*([\d,]+)/i);
    
    if (gramMatch && gramMatch[1]) {
      const ratePerGram = parseInt(gramMatch[1].replace(/,/g, ''));
      const ratePer10g = ratePerGram * 10;
      console.log('Found silver rate per gram from table:', ratePerGram, '→ per 10g:', ratePer10g);
      return ratePer10g;
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
    console.log('===== Fetching fresh rates from Moneycontrol... =====');
    
    // Fetch both gold and silver rates from Moneycontrol
    const goldRates = await fetchGoldRatesFromMoneycontrol();
    const silverPer10g = await fetchSilverRateFromMoneycontrol();

    console.log('Scraped values:', {
      gold24kPer10g: goldRates.gold24k,
      gold22kPer10g: goldRates.gold22k,
      silverPer10g
    });

    // Format the response (all per 10 grams)
    const rates: RatesData = {
      gold_24k: goldRates.gold24k > 0 ? `₹ ${goldRates.gold24k.toLocaleString('en-IN')}` : 'N/A',
      gold_22k: goldRates.gold22k > 0 ? `₹ ${goldRates.gold22k.toLocaleString('en-IN')}` : 'N/A',
      silver: silverPer10g > 0 ? `₹ ${silverPer10g.toLocaleString('en-IN')}` : 'N/A',
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
