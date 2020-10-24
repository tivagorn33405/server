module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
        title: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        pictures: DataTypes.STRING,
        content: DataTypes.TEXT,
        category: DataTypes.STRING,
        status: DataTypes.STRING,
        prices: DataTypes.STRING
    })
    return Ticket
}