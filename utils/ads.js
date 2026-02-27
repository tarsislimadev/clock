export const getRandomAd = () => {
  const ads = [
    { id: '1', title: 'Ad 1', link: 'https://example.com/1' },
    { id: '2', title: 'Ad 2', link: 'https://example.com/2' },
    { id: '3', title: 'Ad 3', link: 'https://example.com/3' }
  ];

  return ads[Math.floor(Math.random() * ads.length)];
}
