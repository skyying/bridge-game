import ReactGA from "react-ga";
export const config = {
  apiKey: "test_api_key",
  authDomain: "test_domain",
  databaseURL: "https://test_database_url.firebaseio.com",
  projectId: "test_project_id",
  storageBucket: "test_storage_bucket",
  messagingSenderId: "test_messaging_sender_id"
};

export const initializeReactGA = () => {
  ReactGA.initialize("test_ga_tracking");
  ReactGA.pageview("/");
};
