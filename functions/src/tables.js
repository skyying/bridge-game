exports.getAll = (newTable, tableIdList) => {
    console.log("tables", tableIdList);
    let tableId = newTable.id;
    tableIdList[tableId] = {
        id: tableId,
        timer: null,
        timeStamp: newTable.timeStamp,
    };
};

exports.update = (oldTableList, newTableList) => {
    if (!newTableList) {
        return -1;
    }
    return Object.keys(oldTableList).filter(
        tableId => newTableList[tableId] !== true,
    )[0];
};
