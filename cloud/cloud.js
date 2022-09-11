Moralis.Cloud.define('getAllItemsSongbird', async (request) => {
  const query = new Moralis.Query('PlanetsSongbird');

  const queryResults = await query.find({ useMasterKey: true });
  const results = [];
  for (let i = 0; i < queryResults.length; ++i) {
    results.push({
      name: queryResults[i].attributes.name,
      owner: queryResults[i].attributes.owner,
      tokenId: queryResults[i].attributes.tokenId,
      description: queryResults[i].attributes.description,
      metadataFilePath: queryResults[i].attributes.metadataFilePath,
      tokenAddress: queryResults[i].attributes.tokenAddress,
      image: queryResults[i].attributes.image,
    });
  }
  return results;
});
