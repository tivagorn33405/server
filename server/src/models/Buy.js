module.exports = (sequelize, DataTypes) => {
    const Buy = sequelize.define('Buy', {
        ticketid: DataTypes.STRING,
        userid: DataTypes.STRING,
        email: DataTypes.STRING,
        qty: DataTypes.STRING,
        prices: DataTypes.STRING,
        clientStatus: DataTypes.STRING,
        shopStatus: DataTypes.STRING,
        tickettitle: DataTypes.STRING,
        username: DataTypes.STRING,
        userlastname: DataTypes.STRING,
    })
    return Buy
}