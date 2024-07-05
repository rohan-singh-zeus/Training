import React from "react";
import "./excel.scss";

const Excel = () => {
  return (
    <div className="excel">
      <canvas width={610} height={610} style={{border: "1px solid #00ff00"}}>
        <table>
          <tr aria-rowindex="2">
            <td aria-colindex="5">Cell 1</td>
            <td aria-colindex="8">A picture of a dog</td>
          </tr>
        </table>
      </canvas>
    </div>
  );
};

export default Excel;
 