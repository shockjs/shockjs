
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tbl_user', function (table) {
        table.increments();
        table.string('firstName');
        table.string('lastName');
        table.string('password');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tbl_user');
};
