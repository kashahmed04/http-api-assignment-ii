const users = {};

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf-8'),
  };

  response.writeHead(status, headers);

  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const updateUser = (request, response) => {
  const newUser = {
    createdAt: Date.now(),
  };

  users[newUser.createdAt] = newUser;

  return respondJSON(request, response, 201, newUser);
};

const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };
  if (!request.body.name && !request.body.age) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;
  const { name, age } = request.body;
  if (!users[name]) {
    responseCode = 201;
    users[name] = {};
  }

  users[name].name = name;
  users[name].age = age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode, {});
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getUsers,
  getUsersMeta,
  updateUser,
  notFound,
  notFoundMeta,
  addUser,
};
