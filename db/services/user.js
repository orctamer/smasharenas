const User = require('../models/users');

module.exports = {
	findOrCreate: async (twitchId) => {
		try {
			const user = await User.findOne({ twitchId: profile.id });
			if (!user) {
				const newUser = new User({
          twitchId: profile.id,
          displayName: profile.display_name,
          profileImage: profile.profile_image_url          
				});
				await newUser.save();
				return newUser;
			}
			return user;
		} catch (e) {
			return Error("User not found");
		}
	},
	findById: async (id) => {
		return User.findOne({ twitchId: id });
	},
};