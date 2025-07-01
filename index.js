const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config({ path: 'variables.env' });


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;
const port = process.env.PORT || 4000;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    // El Bearer Token hay que borrarlo antes de subirlo a GitHub
    try {
        console.log(PRIVATE_APP_ACCESS)
        const response = await axios.get('https://api.hubapi.com/crm/v3/objects/2-46476403', {
            headers: {
                'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`,
            },
            params: {
                properties: 'name,chipnumber,breed'
            }
        });

        const records = response.data.results;
        console.log(response.data);
        res.render('homepage', { title: 'Pets Information', records });
    } catch (error) {
        console.error('ERROR DE HUBSPOT:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
        res.send('Error fetching data');
    }
});


// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', (req, res) => {
  res.render('update-cobj', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// * Code for Route 2 goes here

app.post('/update-cobj', async (req, res) => {
  const { id, name, chipnumber, breed } = req.body;

  const payload = {
    properties: {
      name,
      chipnumber,
      breed
    }
  };

  try {
    if (id && id.trim() !== '') {
      // Actualizar objeto existente
      await axios.patch(`https://api.hubapi.com/crm/v3/objects/2-46476403/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Crear nuevo objeto
      await axios.post('https://api.hubapi.com/crm/v3/objects/2-46476403', payload, {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error creando/actualizando:', error.response?.data || error.message);
    res.status(500).send('Error creando o actualizando el objeto.');
  }
});
// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));