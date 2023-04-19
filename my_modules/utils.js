const axios = require('axios');
const {
  facebookConfig
} = require('../config.json');
const {
  campaignData
} = require('../data.json');

//Retrieve Access Token from facebook API
const getAccessToken = (code, cb) => {
  axios.get(`https://graph.facebook.com/${facebookConfig.apiVersion}/oauth/access_token?client_id=${facebookConfig.clientId}&redirect_uri=${encodeURIComponent(facebookConfig.redirectUri)}&client_secret=${facebookConfig.clientSecret}&code=${code}`).then(response => {
    cb(null, response.data);
  }).catch(err => {
    cb(err && err.response ? err.response.data : 'Can\'t get access token');
  });
};

//Retrieve User Data From Facebook API
exports.oauth = (code, cb) => {
  getAccessToken(code, (err, response) => {
    if (err) {
      cb(err);
    } else {
      axios.get(`https://graph.facebook.com/${facebookConfig.apiVersion}/me?access_token=${response.access_token}&fields=id,name,email,picture,adaccounts{id,name}`).then(resp => {
        cb(null, {
          access_token: response.access_token,
          ...resp.data
        });

      }).catch(err => {
        cb(err && err.response ? err.response.data : 'Can\'t get user data');
      });
    }
  });
};

//Create Ad Campaign
const createAdCampaign = (data, cb) => {
  axios.post(`https://graph.facebook.com/${facebookConfig.apiVersion}/${data.adAccountId}/campaigns?access_token=${data.access_token}`, data.params).then(response => {
    cb(null, response.data);
  }).catch(err => {
    cb(err && err.response ? err.response.data : 'Can\'t create Campaign');
  });
};

exports.createAdCampaign = createAdCampaign;

//Create Ad bluk Campaign
const createAdCampaigns = (data, cb) => {
  createAdCampaign(data, (err, response) => {
    if (err) {
      cb(err);
    } else {
      if (data.campaigns.length) {
        data.params = {
          ...campaignData,
          ...data.campaigns[0]
        }
        data.campaigns.shift();
        data.campaigns = data.campaigns;
        createAdCampaigns(data, cb);
      } else {
        cb({
          message: 'Campaigns created successfully.'
        });
      }
    }
  });
};

exports.createAdCampaigns = createAdCampaigns;

//Create Adsets
exports.createAdsets = (data, cb) => {
  // console.log(data);
  axios.post(`https://graph.facebook.com/${facebookConfig.apiVersion}/${data.adAccountId}/adsets?access_token=${data.access_token}`, data.params).then(response => {
    cb(null, response.data);
  }).catch(err => {
    cb(err && err.response ? err.response.data : 'Can\'t create Adsets');
  });
};

//Create Adsets
exports.createAd = (data, cb) => {
  // console.log(data);
  axios.post(`https://graph.facebook.com/${facebookConfig.apiVersion}/${data.adAccountId}/ads?access_token=${data.access_token}`, data.params).then(response => {
    cb(null, response.data);
  }).catch(err => {
    cb(err && err.response ? err.response.data : 'Can\'t create Ads');
  });
};

/******************* Update route function ************/
//Update Ad Campaign
exports.updateAdCampaign = (data, cb) => {
  axios.post(`https://graph.facebook.com/${facebookConfig.apiVersion}/${data.campaign_id}?access_token=${data.access_token}`, data.params).then(response => {
    cb(null, response.data);
  }).catch(err => {
    console.log(err);
    cb(err && err.response ? err.response.data : 'Can\'t update Campaign');
  });
};

//Update adsets
exports.updateadsets = (data, cb) => {
  axios.post(`https://graph.facebook.com/${facebookConfig.apiVersion}/${data.adset_id}?access_token=${data.access_token}`, data.params).then(response => {
    cb(null, response.data);
  }).catch(err => {
    cb(err && err.response ? err.response.data : 'Can\'t update Adsets');
  });
};

//Update ad
exports.updateAd = (data, cb) => {
  axios.post(`https://graph.facebook.com/${facebookConfig.apiVersion}/${data.ad_id}?access_token=${data.access_token}`, data.params).then(response => {
    cb(null, response.data);
  }).catch(err => {
    cb(err && err.response ? err.response.data : 'Can\'t update Ad');
  });
};

/******************* Read Insights route function ************/
const readInsights = (data, rd, after, cb) => {
  axios.get(`https://graph.facebook.com/${facebookConfig.apiVersion}/${data.campaign_id}/insights?access_token=${data.access_token}&fields=${data.params.fields}&date_preset=${data.params.date_preset}&level=${data.params.level}${after ? `&after=${after}` : ''}`).then(response => {
    if (response.data.data && response.data.data.length) {
      rd = [...rd, ...response.data.data];
      if (response.data.paging && response.data.paging.cursors && response.data.paging.cursors.after) {
        readInsights(data, rd, response.data.paging.cursors.after, cb);
      } else {
        cb(null, rd);
      }
    } else {
      cb(null, rd);
    }
  }).catch(err => {
    cb(err && err.response ? err.response.data : 'Can\'t get Insights');
  });
};

exports.readInsights = readInsights;