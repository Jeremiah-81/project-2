const Hike = require('./Hike');
const User = require('./User');

User.hasMany(Hike, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Hike.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = {User, Hike};