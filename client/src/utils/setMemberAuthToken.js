import axios from "axios";

const setMemberAuthToken = (membertoken) => {
  if (membertoken) {
    axios.defaults.headers.common["x-member-auth-token"] = membertoken;
  } else {
    delete axios.defaults.headers.common["x-member-auth-token"];
  }
};

export default setMemberAuthToken;
