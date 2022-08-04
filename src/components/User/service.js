const UserModel = require('./models/users');

/**
 * @exports
 * @method findByQuery
 * @param {string} query
 * @param {number} limit
 * @summary get list of all users
 * @returns Promise<UserModel[]>
 */
function findByQuery(query, limit) {
  return UserModel
    .find(
      {
        $or: [
          { $text: { $search: query } },
          { nickname: { $regex: query } },
        ],
      },
      { score: { $meta: 'textScore' } },
    )
    .select({ _id: 1, nickname: 1 })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .exec();
}

/**
 * @exports
 * @method findById
 * @param {string} id
 * @summary get a user
 * @returns {Promise<UserModel>}
 */
function findById(id) {
  return UserModel.findById(id).exec();
}

/**
 * @exports
 * @method exists
 * @param {object} filter
 * @summary boolean for provided filter
 * @returns {Promise<boolean>}
 */
async function exists(filter) {
  return (await UserModel.findOne(filter).select({ _id: 1 }).lean()) !== null;
}

/**
 * @exports
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<UserModel>}
 */
function create(profile) {
  return UserModel.create(profile);
}

/**
 * Find a user by id and update his profile
 * @exports
 * @method updateById
 * @param {string} _id
 * @param {object} newProfile
 * @summary update a user's profile
 * @returns {Promise<void>}
 */
function updateById(_id, newProfile) {
  return UserModel.findOneAndUpdate({ _id }, newProfile, { new: true }).exec();
}

/**
 * @exports
 * @method deleteById
 * @param {string} _id
 * @summary delete a user from database
 * @returns {Promise<void>}
 */
function deleteById(_id) {
  return UserModel.findOneAndDelete({ _id }).exec();
}

module.exports = {
  findByQuery,
  findById,
  exists,
  create,
  updateById,
  deleteById,
};
