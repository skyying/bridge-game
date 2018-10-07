// const functions = require("firebase-functions");
exports.admin = require("firebase-admin");
exports.init = () => {
    this.admin.initializeApp();
};

exports.getAllDataOnce = (path, callback) => {
    this.admin
        .database()
        .ref(path)
        .once("value", callback);
};

exports.listenPathDataChange = type => (path, callback) =>
    this.admin
        .database()
        .ref(path)
        .on(type, callback);

exports.setTableDataById = table => {
    this.admin
        .database()
        .ref(`tables/${table.id}/`)
        .set(table);
};

exports.setTableData = (path, id, data) => {
    this.admin
        .database()
        .ref(`tables/${id}/${path}`)
        .set(data);
};

exports.setTableListData = (id, data) => {
    this.admin
        .database()
        .ref(`tableList/${id}/`)
        .set(data);
};
exports.getNewChildKey = node => {
    return this.admin
        .database()
        .ref()
        .child(node)
        .push().key;
};
