const express = require('express');
const app = express();
app.use(express.json());
const fs = require("fs/promises");
const path = require('path');
const shortid = require('shortid');
const dbLocation = path.resolve("src/customers", "customers.json");


app.post('/customer', async (req, res) => {
    try {
        const data = await fs.readFile(dbLocation);
        const customers = JSON.parse(data);
        const { name, email, phone, address } = req.body;
        const newCustomer = {
            id: shortid.generate(),
            name,
            email,
            phone,
            address
        };

        const oldCustomer = customers.find(customer => customer.email === email);
        if (oldCustomer) {
            return res.status(302).json({ message: "This Customer already registered" });
        }

        customers.push(newCustomer);
        await fs.writeFile(dbLocation, JSON.stringify(customers));

        return res.status(201).json({ message: "Customer added successfully", newCustomer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/customers', async (req, res) => {
    try {
        const data = await fs.readFile(dbLocation);
        const customers = JSON.parse(data);

        if (customers.length === 0) {
            return res.status(404).json({ message: "Customers Not Found" });
        }

        return res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/customer/:id', async (req, res) => {
    try {
        const data = await fs.readFile(dbLocation);
        const customers = JSON.parse(data);
        const customer = customers.find(customer => customer.id === req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer Not Found" });
        }

        return res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.patch('/customer/:id', async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        const data = await fs.readFile(dbLocation);
        let customers = JSON.parse(data);
        let customer = customers.find((customer) => customer.id === req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer Not Found" });
        }
        customer.name = name;
        customer.email = email;
        customer.phone = phone;
        customer.address = address;

        await fs.writeFile(dbLocation, JSON.stringify(customers));
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put('/customer/:id', async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        const data = await fs.readFile(dbLocation);
        let customers = JSON.parse(data);
        const customerIndex = customers.findIndex((customer) => customer.id === req.params.id);

        if (customerIndex === -1) {
            const newCustomer = { id: shortid.generate(), name, email, phone, address };
            const oldCustomer = customers.find(customer => customer.email === email);
            if (oldCustomer) {
                return res.status(302).json({ message: "This Customer already registered" });
            }
            customers.push(newCustomer);
            await fs.writeFile(dbLocation, JSON.stringify(customers));
            res.status(201).json(newCustomer);
        } else {
            const updatedCustomer = {
                ...customers[customerIndex],
                name,
                email,
                phone,
                address
            };

            customers[customerIndex] = updatedCustomer;
            await fs.writeFile(dbLocation, JSON.stringify(customers));
            res.status(200).json(updatedCustomer);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete('/customer/:id', async (req, res) => {
    const data = await fs.readFile(dbLocation);
    let customers = await JSON.parse(data);
    let customerIndex = customers.findIndex(customer => customer.id === req.params.id);
    console.log(customerIndex);

    if (customerIndex !== -1) {
        customers.splice(customerIndex, 1);
        await fs.writeFile(dbLocation, JSON.stringify(customers));
        return res.status(200).json({ message: "Customer deleted successfully." });
    }
    res.status(404).json({ message: "Customer not found." });
});









app.listen(4000, () => {
    console.log("Server Started, http://localhost:4000");
})