var request = require('request');
const NodeGeocoder = require('node-geocoder');

import { HTTP_STATUS_CODE } from './enum';

const url = 'https://data.sfgov.org/resource/yitu-d5am.json';

const options = {
  provider: 'opencage',
  // Optional depending on the providers
  apiKey: '0ba20dd7daf348ac8bc2496adb7397f5',
};
 
const geocoder = NodeGeocoder(options);
 

const filterData = async (data) => {
  const allDataWithoutNullLocation = data.filter(list => list.locations).slice(0, 400);
  const locations = allDataWithoutNullLocation.map(d => d.locations)
  const response = await (await geocoder.batchGeocode(Array.from(new Set(...[locations])))).map(data => data.value[0]);
  

  const geocoderResponse =  locations.map((location,index) => ({
    location: location,
    latlng:  response[index]
  }));

    return {
      locationData: allDataWithoutNullLocation.map((data, index) => ({
        ...data,
        latlng: geocoderResponse.filter(resp => resp.location === data.locations)[0] ? geocoderResponse.filter(resp => resp.location === data.locations)[0].latlng : [],
      }))
    };
}


const getList = (req, resp) => {
  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, async (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      const {locationData} = await filterData(data);
      resp.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        data: locationData,
        count: locationData.length
      })
    }
  });
}

export { getList }



