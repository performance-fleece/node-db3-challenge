const db = require('./dbConfig.js');

module.exports = {
  find,
  findById,
  findSteps,
  add,
  update,
  remove,
  addStep
};

function find() {
  return db('schemes');
}

function findById(id) {
  return db('schemes')
    .where({ id })
    .first();
}

function findSteps(id) {
  return db('steps as st')
    .join('schemes as sc', 'sc.id', 'st.scheme_id')
    .select('st.id', 'sc.scheme_name', 'st.step_number', 'st.instructions')
    .where('st.scheme_id', id);
}

function add(scheme) {
  return db('schemes')
    .insert(scheme)
    .then(id => {
      return findById(id[0]);
    });
}

function update(changes, id) {
  return db('schemes')
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}

async function remove(id) {
  const item = await findById(id);

  return db('schemes')
    .select('schemes.scheme_name')
    .where('id', id)
    .del()
    .then(() => {
      return item;
    });
}

function addStep(step, scheme_id) {
  const schemeId = { scheme_id: scheme_id };
  const newItem = { ...step, ...schemeId };

  return db('steps')
    .insert(newItem)
    .then(() => {
      return findSteps(scheme_id);
    });
}
