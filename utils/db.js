import mongoose from "mongoose";

const connections = {};

async function connect(dbName) {
  if (connections[dbName]?.isConnected) {
    return;
  }

  if (mongoose.connections.length > 0) {
    const existingConnection = mongoose.connections.find(
      conn => conn.name === dbName
    );
    if (existingConnection && existingConnection.readyState === 1) {
      connections[dbName] = {
        isConnected: true,
        dbName: dbName
      };
      return;
    }
  }

  const db = await mongoose.connect(process.env.MONGO_URI, {
    dbName
  });

  connections[dbName] = {
    isConnected: db.connections[0].readyState,
    dbName: dbName
  };
}

const db = { connect }
export default db


// hits_view_search — показы в поиске и в категории.
// hits_view_pdp — показы на карточке товара.
// hits_view — всего показов.
//hits_tocart — всего добавлено в корзину.
//session_view — всего сессий. Считаются уникальные посетители.
// conv_tocart_search — конверсия в корзину из поиска или категории.
// conv_tocart_pdp — конверсия в корзину из карточки товара.
// conv_tocart — общая конверсия в корзину.