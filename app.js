const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Suppress the strictQuery deprecation warning
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/busdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => console.error('Error connecting to MongoDB:', err));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define schemas for the bus, driver, and trip models
const busSchema = new mongoose.Schema({
    busId: String,
    depo: String,
    noOfSeats: Number,
    drivername: String,
    ownername: String,
});

const Bus = mongoose.model('Bus', busSchema);

const driverSchema = new mongoose.Schema({
    drivername: String,
    licenseno: Number,
    phone: Number,
    Age: Number,
    experience: Number,
});

const Driver = mongoose.model('Driver', driverSchema);

const tripSchema = new mongoose.Schema({
    tripno: Number,
    date: String,
    busno: Number,
    to: String,
    fro: String,
    noofseats: Number,
});

const Trip = mongoose.model('Trip', tripSchema);

// Routes...

// Route for the welcome page
app.get('/', (req, res) => {
    res.render('index');
});

// Route for bus registration page
app.get('/bus-details-form', (req, res) => {
    res.render('bus-details-form');
});

// Route for handling bus registration form submission
app.post('/submit-registration', (req, res) => {
    const formData = req.body;
    const newBus = new Bus({
        busId: formData.busId,
        depo: formData.depo,
        noOfSeats: formData.noOfSeats,
        drivername: formData.drivername,
        ownername: formData.ownername,
    });
    newBus.save()
        .then(() => {
            console.log('Bus registration successful:', newBus);
            res.redirect('/thanku');
        })
        .catch(err => {
            console.error('Error saving bus registration:', err);
            res.status(500).send('Error saving bus registration');
        });
});

// Route for driver registration page
app.get('/driver-details-form', (req, res) => {
    res.render('driver-details-form');
});

// Route for handling driver registration form submission
app.post('/submit', (req, res) => {
    const formData = req.body;
    const newDriver = new Driver({
        drivername: formData.drivername,
        licenseno: formData.licenseno,
        phone: formData.phone,
        Age: formData.Age,
        experience: formData.experience,
    });
    newDriver.save()
        .then(() => {
            console.log('Driver registration successful:', newDriver);
            res.redirect('/thanku');
        })
        .catch(err => {
            console.error('Error saving driver registration:', err);
            res.status(500).send('Error saving driver registration');
        });
});

// Route for trip registration page
app.get('/trip-details-form', (req, res) => {
    res.render('trip-details-form');
});

// Route for handling trip registration form submission
app.post('/submit-trip', (req, res) => {
    const formData = req.body;
    const newTrip = new Trip({
        tripno: formData.tripno,
        date: formData.date,
        busno: formData.busno,
        to: formData.to,
        fro: formData.fro,
        noofseats: formData.noofseats,
    });
    newTrip.save()
        .then(() => {
            console.log('Trip registration successful:', newTrip);
            // Render the trip-details page again with the trip details
            res.render('thanku', { tripDetails: newTrip });
        })
        .catch(err => {
            console.error('Error saving trip registration:', err);
            res.status(500).send('Error saving trip registration');
        });
});


// Route for thank you page after successful registration
app.get('/thanku', (req, res) => {
    res.render('thanku');
});

// Route for bus details page
app.get('/bus-details', (req, res) => {
    res.render('bus-details');
});

// Route for handling bus details form submission
app.post('/get-bus-details', (req, res) => {
    const busId = req.body.busId;
    Bus.findOne({ busId: busId })
        .then(bus => {
            if (bus) {
                res.render('bus-details-details', { busDetails: bus });
            } else {
                res.render('bus-details', { error: 'Bus not found' });
            }
        })
        .catch(error => {
            console.error('Error retrieving bus details:', error);
            res.render('bus-details', { error: 'Error retrieving bus details' });
        });
});

// Route for driver details page
app.get('/driver-details', (req, res) => {
    res.render('driver-details');
});

// Route for handling driver details form submission
app.post('/get-driver-details', (req, res) => {
    const drivername = req.body.drivername;
    Driver.findOne({ drivername: drivername })
        .then(driver => {
            if (driver) {
                res.render('driver-details-details', { driverDetails: driver });
            } else {
                res.render('driver-details', { error: 'Driver not found' });
            }
        })
        .catch(error => {
            console.error('Error retrieving driver details:', error);
            res.render('driver-details', { error: 'Error retrieving driver details' });
        });
});

// Route for trip details page
app.get('/trip-details', (req, res) => {
    res.render('trip-details');
});

// Route for handling trip details form submission
// Route for handling trip details form submission
app.post('/get-trip-details', (req, res) => {
    const { tripno } = req.body;
    Trip.findOne({ tripno: tripno })
        .then(trip => {
            if (trip) {
                res.render('trip-details-details', { tripDetails: trip });
            } else {
                res.render('trip-details', { error: 'Trip not found' });
            }
        })
        .catch(error => {
            console.error('Error retrieving trip details:', error);
            res.render('trip-details', { error: 'Error retrieving trip details' });
        });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

