import React from "react";
import { Link } from "react-router-dom";

const A: React.FC = () => {
  return (
    <div data-click="click_a">
      Page A <Link to="/page/b"> To Page B</Link>
    </div>
  );
};
export default A;
