const express = require("express");
const router = new express.Router();
const {
  facebookConfig
} = require("../config.json");

const {
  campaignData,
  adsetsData,
  adData,
  insightsData
} = require('../data.json');

const {
  oauth,
  createAdCampaign,
  createAdCampaigns,
  createAdsets,
  createAd,
  updateAdCampaign,
  updateadsets,
  updateAd,
  readInsights
} = require('../my_modules/utils');

/******************* Authentication route ************/

router.get("/facebook/auth", (req, res) => {
  res.redirect(`https://www.facebook.com/${facebookConfig.apiVersion}/dialog/oauth?client_id=${facebookConfig.clientId}&redirect_uri=${facebookConfig.redirectUri}&state=${Math.round(Math.random() * 10000000000)}&scope=${facebookConfig.scope}&response_type=code`);
});

router.get("/facebook/auth/success", (req, res) => {
  const code = decodeURIComponent(req.query.code);
  const state = decodeURIComponent(req.query.state);
  if (code && state) {
    oauth(code, (err, response) => {
      if (err) {
        res.status(401).json(err);
      } else {
        res.status(200).json(response);
      }
    });
  } else {
    res.status(401).send('Data cannot be fetched');
  }
});

/******************* Creation route ************/

//Facebook Campaign creation route
router.post("/facebook/campaign/create", (req, res) => {
  const data = {
    access_token: req.body.access_token,
    adAccountId: req.body.adAccountId,
    params: {
      ...campaignData,
      ...req.body.params
    }
  };
  createAdCampaign(data, (err, response) => {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

//Facebook bulk Campaign creation route
router.post("/facebook/campaign-bulk/create", (req, res) => {
  if (req.body.campaigns && req.body.campaigns.length) {
    const data = {
      access_token: req.body.access_token,
      adAccountId: req.body.adAccountId,
      params: {
        ...campaignData,
        ...req.body.campaigns[0]
      }
    };
    req.body.campaigns.shift();
    data.campaigns = req.body.campaigns;
    createAdCampaigns(data, (err, response) => {
      if (err) {
        res.status(401).json(err);
      } else {
        res.status(200).json(response);
      }
    });
  } else {
    res.status(401).json({
      error: 'No campaign found!'
    });
  }
});

//Facebook Adsets creation route
router.post("/facebook/adsets/create", (req, res) => {
  const data = {
    access_token: req.body.access_token,
    adAccountId: req.body.adAccountId,
    params: {
      ...adsetsData,
      ...req.body.params
    }
  };
  createAdsets(data, (err, response) => {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

//Facebook Ad creation route
router.post("/facebook/ad/create", (req, res) => {
  const data = {
    access_token: req.body.access_token,
    adAccountId: req.body.adAccountId,
    params: {
      ...adData,
      ...req.body.params
    }
  };
  createAd(data, (err, response) => {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(response);
    }
  });
});


/******************* Update route ************/
//Facebook Campaign update
router.post("/facebook/campaign/update", (req, res) => {
  const data = {
    access_token: req.body.access_token,
    campaign_id: req.body.campaign_id,
    params: {
      ...req.body.params
    }
  };
  updateAdCampaign(data, (err, response) => {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

//Facebook Adsets update
router.post("/facebook/adsets/update", (req, res) => {
  const data = {
    access_token: req.body.access_token,
    adset_id: req.body.adset_id,
    params: {
      ...req.body.params
    }
  };
  updateadsets(data, (err, response) => {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

//Facebook Ad update
router.post("/facebook/ad/update", (req, res) => {
  const data = {
    access_token: req.body.access_token,
    ad_id: req.body.ad_id,
    params: {
      ...req.body.params
    }
  };
  updateAd(data, (err, response) => {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

/******************* Read Insights route ************/
router.post("/facebook/campaign/insights", (req, res) => {
  const data = {
    access_token: req.body.access_token,
    campaign_id: req.body.campaign_id,
    params: {
      ...insightsData,
      ...req.body.params
    }
  };
  readInsights(data, [], null, (err, response) => {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

module.exports = router;
