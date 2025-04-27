import Button from "../components/ui/Button";
const Login = () => {
  const BASE_URL = import.meta.env.VITE_AXIOS_BASE_URL;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <img
              src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
              alt="Google Drive"
              className="h-12 w-12 mx-auto mb-2"
            />
            <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
            <p className="text-gray-600 mt-1">
              Access your files in Google Drive
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() =>
                (window.location.href = `${
                  BASE_URL
                }/auth/google`)
              }
              className="justify-center py-3"
            >
              Sign in with Google
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Please authenticate yourself</p>
              <p>using your google account</p>
              <p>Hi, I am currently using render's free tier due to which there might be an issue of cold start</p>
              <p>Please wait some time till the server is up</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
