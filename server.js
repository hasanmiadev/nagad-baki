const express = require('express');
const app = express();
app.use(express.json());
const fs = require("fs/promises");
const path = require('path');
const shortid = require('shortid');
const dbLocation = path.resolve("src/customers", "customers.json");


/**Create new Customar */
app.post('/addcustomer', async (req, res) => {
    const data = await fs.readFile(dbLocation)
    let customers = await JSON.parse(data)
    const { name, email, phone, address } = req.body;
    const newCustomer = {
        id: shortid.generate(),
        name,
        email,
        phone,
        address
    }
    const oldCustomer = customers.find(customer => customer.email === email);
    if (oldCustomer) {
        return res.status(302).json({ message: `This Customer already registered` })
    }
    await customers.push(newCustomer);
    await fs.writeFile(dbLocation, JSON.stringify(customers))
    res.status(201).json({ message: 'Customer added successfully', newCustomer })
})

//** Get All Customers */

app.get('/customers', async (req, res) => {
    const data = await fs.readFile(dbLocation)
    let customers = await JSON.parse(data)
    if (!customers.length > 0) {
        return res.status(404).json({ message: "Customers Not Found" })
    }
    res.status(200).json(customers);
})


/**
 * Get One Customers by ID 
 */

app.get('/customer/:id', async (req, res) => {
    const data = await fs.readFile(dbLocation)
    let customers = await JSON.parse(data)
    const customer = customers.find(customer => customer.id === req.params.id);
    if (!customer) {
        return res.status(404).json({ message: "Customer Not Found" })
    }
    res.status(200).json(customer)
})

/**
 * Update Customer Information
 */

app.patch('/customer/:id', async (req, res) => {
    const { name, email, phone, address } = req.body;
    const data = await fs.readFile(dbLocation)
    let customers = await JSON.parse(data)
    let customer = customers.find((customer) => customer.id === req.params.id);
    if (!customer) {
        return res.status(404).json({ message: "Customer Not Found" })
    }else{
        customer.id = customer.id;
        customer.name = name;
        customer.email = email;
        customer.phone = phone;
        customer.address = address;
    }
    await fs.writeFile(dbLocation, JSON.stringify(customers))
    res.status(200).json(customer)
})











app.listen(4000, () => {
    console.log("Server Started, http://localhost:4000");
})