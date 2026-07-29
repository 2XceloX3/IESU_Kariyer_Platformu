const path = require('path');
const { pathToFileURL } = require('url');

async function testLiveDataResilience() {
  const fileUrl = pathToFileURL(path.resolve(__dirname, '../../src/utils/liveData.js')).href;
  const liveDataModule = await import(fileUrl);

  console.log('--- TEST 1: Inspect liveData.js exports ---');
  console.log('Exports in utils/liveData.js:', Object.keys(liveDataModule));
  console.log('liveSliderData length:', liveDataModule.liveSliderData?.length);
  console.log('liveNewsData length:', liveDataModule.liveNewsData?.length);
  console.log('liveAnnouncementsData length:', liveDataModule.liveAnnouncementsData?.length);
  console.log('liveEventData length:', liveDataModule.liveEventData?.length);
  console.log('liveStatsData length:', liveDataModule.liveStatsData?.length);

  console.log('\n--- TEST 2: Check schema consistency across live items ---');
  const checkItems = (items, name, requiredFields) => {
    if (!Array.isArray(items)) {
      console.log(`[FAIL] ${name} is not an array!`);
      return;
    }
    items.forEach((item, idx) => {
      requiredFields.forEach(field => {
        if (item[field] === undefined || item[field] === null) {
          console.log(`[WARNING] ${name}[${idx}] missing required field "${field}":`, item);
        }
      });
    });
  };

  checkItems(liveDataModule.liveSliderData, 'liveSliderData', ['title', 'image']);
  checkItems(liveDataModule.liveNewsData, 'liveNewsData', ['id', 'title', 'date', 'description']);
  checkItems(liveDataModule.liveAnnouncementsData, 'liveAnnouncementsData', ['id', 'title', 'date']);
  checkItems(liveDataModule.liveEventData, 'liveEventData', ['id', 'title', 'date', 'location']);

  console.log('\n--- TEST 3: NelerOluyorPanel null liveNewsData indexing test ---');
  try {
    const liveNewsData = null;
    const testIndexing = () => {
      const fallback = [
        { id: '1', rawItem: liveNewsData ? liveNewsData[0] : null } // Safe vs Unsafe: liveNewsData[0]
      ];
    };
    // Let's test unsafe: liveNewsData[0]
    try {
      const val = liveNewsData[0];
    } catch (err) {
      console.log('BUG CONFIRMED: Direct indexing liveNewsData[0] when liveNewsData is null throws:', err.message);
    }
  } catch (err) {
    console.error(err);
  }

  console.log('\n--- TEST 4: HeroSlider heroSlides.length modulo test when empty [] ---');
  try {
    const heroSlides = [];
    let currentSlide = 0;
    const nextSlide = (currentSlide + 1) % heroSlides.length;
    console.log('nextSlide when heroSlides is []:', nextSlide); // NaN
    if (Number.isNaN(nextSlide)) {
      console.log('BUG CONFIRMED: HeroSlider produces NaN on empty slider array due to % 0!');
    }
  } catch (err) {
    console.error(err);
  }
}

testLiveDataResilience();
