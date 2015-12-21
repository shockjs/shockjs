
exports.up = (knex, Promise) => {

    const type = knex.schema.createTable('tbl_authType', (table) => {
        table.string('name').notNullable();
        table.integer('type').notNullable();
        table.text('description');
        table.string('created_at').notNullable();
        table.string('updated_at').notNullable();
        table.primary('name');
    }).catch(function(error) {
        console.error(error);
    });

    const typeChild = type.then(() => {
        return knex.schema.createTable('tbl_authTypeChild', (table) => {
            table.string('parent')
                .references('name')
                .inTable('tbl_authType')
                .onDelete('cascade')
                .onUpdate('cascade')
                .notNullable();
            table.string('child')
                .references('name')
                .inTable('tbl_authType')
                .onDelete('cascade')
                .onUpdate('cascade')
                .notNullable();
            table.primary(['parent', 'child']);
        });
    }).catch((error) => {
        console.error(error);
    });

    const typeAssign = typeChild.then(() => {
        return knex.schema.createTable('tbl_authAssignment', (table) => {
            table.string('name')
                .references('name')
                .inTable('tbl_authType')
                .notNullable()
                .onDelete('cascade')
                .onUpdate('cascade');
            table.integer('user_id', 10)
                .unsigned()
                .references('id')
                .inTable('tbl_user')
                .notNullable();

            table.primary(['name', 'user_id']);
        });
    }).catch((error) => {
        console.error(error);
    });

    return typeAssign;

};

exports.down = (knex, Promise) => {
    const dropAssign = knex.schema.dropTable('tbl_authAssignment');
    const dropTypeChild = dropAssign.then(() => knex.schema.dropTable('tbl_authTypeChild'));
    const dropType = dropTypeChild.then(() => knex.schema.dropTable('tbl_authType'));
    return dropType;
};
