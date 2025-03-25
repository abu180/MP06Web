// backend/Customers/CustomersController.js
const {
  getAllCustomers,
  addCustomerValues,
  deactivateCustomer: deactivateCustomerModel,
  activateCustomer: activateCustomerModel,
  updateCustomerValues,
  getCustomerByIdValues,
  getRemovedCustomersValues
} = require('./CustomersModel');

// Obtener todos los clientes (solo los activos)
async function getCustomers(req, res) {
  try {
    const customers = await getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes" });
  }
}

// Añadir un nuevo cliente
async function addCustomer(req, res) {
  const { Name, Surname, Phone, Adress, Country, PostalCode } = req.body;
  try {
    const newCustomerId = await addCustomerValues({ Name, Surname, Phone, Adress, Country, PostalCode });
    res.status(201).json({ customer_id: newCustomerId });
  } catch (error) {
    console.error("Error al añadir el cliente:", error);
    res.status(500).json({ error: 'Error al añadir el cliente' });
  }
}

// Dar de baja un cliente (actualiza is_active a 0 y asigna Deletion_time)
async function deactivateCustomer(req, res) {
  const { id } = req.params;
  try {
    const result = await deactivateCustomerModel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ message: "Cliente dado de baja con éxito" });
  } catch (error) {
    console.error("Error al dar de baja el cliente:", error);
    res.status(500).json({ message: "Error al dar de baja el cliente", error });
  }
}

// Dar de alta un cliente (actualiza is_active a 1)
async function activateCustomer(req, res) {
  const { id } = req.params;
  try {
    const result = await activateCustomerModel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ message: "Cliente activado con éxito" });
  } catch (error) {
    console.error("Error al dar de alta el cliente:", error);
    res.status(500).json({ message: "Error al dar de alta el cliente", error });
  }
}

// Actualizar un cliente
async function updateCustomer(req, res) {
  const { id } = req.params;
  const { Name, Surname, Phone, Adress, Country, PostalCode } = req.body;
  try {
    const updatedCustomer = await updateCustomerValues(id, { Name, Surname, Phone, Adress, Country, PostalCode });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error al editar el cliente:", error);
    res.status(500).json({ error: 'Error al editar el cliente' });
  }
}

// Obtener un cliente por ID
async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const customer = await getCustomerByIdValues(id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
}

// Obtener clientes eliminados (is_active = 0)
async function getRemovedCustomers(req, res) {
  try {
    const customers = await getRemovedCustomersValues();
    res.json(customers);
  } catch (error) {
    console.error("Error al obtener clientes eliminados:", error);
    res.status(500).json({ message: "Error al obtener clientes eliminados" });
  }
}

module.exports = {
  getCustomers,
  addCustomer,
  deactivateCustomer,
  activateCustomer,
  updateCustomer,
  getCustomerById,
  getRemovedCustomers
};
