// import { useEffect, useState } from "react";
// import axios from "../services/axios";

// export function useAuth() {
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     axios.get("/auth/me")
//       .then(res => setIsAuthenticated(res.data.isAuthenticated))
//       .catch(() => setIsAuthenticated(false))
//       .finally(() => setLoading(false));
//   }, []);

//   return { loading, isAuthenticated };
// }

import { useEffect, useState } from "react";
import axios from "../services/axios";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get("/api/user")
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  return { loading, isAuthenticated };
}
