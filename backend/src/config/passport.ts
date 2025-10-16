import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User"; // Path đến model
import { generateToken } from "../services/auth.service"; // Từ authService trước đó

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback", // Phải match với Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user bằng Google email
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (!user) {
          // Tạo user mới nếu chưa tồn tại (dùng profile info)
          user = new User({
            fullName: profile.displayName,
            userName: profile.emails?.[0].value.split("@")[0], // Tạo userName từ email (có thể unique hóa sau)
            email: profile.emails?.[0].value,
            phone: "", // Không có từ Google, để trống
            password: "", // Không cần password cho Google user
            role: "user",
            googleId: profile.id, // Thêm field googleId vào User model nếu cần
          });
          await user.save();
        }

        // Trả về user
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize/Deserialize user (cho session, nhưng ta dùng JWT nên optional)
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
