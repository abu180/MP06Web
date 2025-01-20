/*
    EL CONTROLADOR MANERJARA LAS SOLUCITUDES PARA OBTENER LOS DATOS
*/


const { getAllCustomers, addCustomerValues, deleteCustomerValues, updateCustomerValues, getCustomerByIdValues } = require('./CustomersModel');

async function getCustomers(req, res) {
    try {
        const customers = await getAllCustomers();
        
        //RESPUESTA EN FORMATO JSON
        res.json(customers);
    } catch (error) {
        console.error("Error al obtener los clientes", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
}


//ANADIR CUSTOMER
async function addCustomer(req, res) {
    const { Name, Surname, Phone, Adress, Country, PostalCode } = req.body;

    try {
        const newCustomer = await addCustomerValues({
            Name,
            Surname,
            Phone,
            Adress,
            Country,
            PostalCode
        });
        res.status(201).json(newCustomer);
    } catch(error) {
        res.status(500).json({error: 'Error al anadir el cliente'});
    };
};


//ELIMINAR CUSTOMER
async function deleteCustomer(req, res) {
    const { id } = req.params;

    try {
        await deleteCustomerValues(id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar el cliente'});
    }
}


async function updateCustomer(req, res) {
    const { id } = req.params;
    const { Name, Surname, Phone, Adress, Country, PostalCode } = req.body;
    
    console.log("ID del cliente:", id);
    console.log("Datos del cliente:", Name, Surname, Phone, Adress, Country, PostalCode);
    
    try {
        const updatedCustomer = await updateCustomerValues(id, {
            Name,
            Surname,
            Phone,
            Adress,
            Country,
            PostalCode
        });

        console.log("Cliente actualizado:", updatedCustomer);

        res.status(201).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({error: 'Error al editar el cliente'});
    }
}

async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const customer = await getCustomerByIdValues(id);
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
}

module.exports = {
    getCustomers,
    addCustomer,
    deleteCustomer,
    updateCustomer,
    getCustomerById
}