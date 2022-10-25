import React from "react";
import { Link } from "react-router-dom";

const B: React.FC = () => {
  return (
    <div data-view="page_b_show">
      Page B <Link to="/page/a"> To Page A</Link>
    </div>
  );
};

export default B;
