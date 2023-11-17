import { useEffect, useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSpace, useMembers, useLocations } from "@ably/spaces/react";
import { useImmer } from "use-immer";

import { useAbly } from "ably/react";

import "./App.css";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import AvatarStack from "./AvatarStack";

function App() {
  let api = null;

  const [rowData, updateRowData] = useImmer([
    {
      id: "a",
      make: "Toyota",
      model: "Celica",
      price: 35000,
      rowMembers: []
    },
    {
      id: "b",
      make: "Ford",
      model: "Mondeo",
      price: 32000,
      rowMembers: []
    },
    {
      id: "c",
      make: "Porsche",
      model: "Boxter",
      price: 72000,
      rowMembers: []
    },
  ]);

  const client = useAbly();
  const { space } = useSpace();
  const { self, others } = useMembers();

  useEffect(() => {
    space?.enter({ clientID: client.auth.clientId });
  }, [space]);

  useEffect(() => {
    others.forEach((member) => {
      if (member.lastEvent.name == 'present') {
        mutateMemberLocations(null, member.location?.nodeid, member.clientId)
      } else if (member.lastEvent.name == 'leave') {
        mutateMemberLocations(member.location?.nodeid, null, member.clientId)
      }
    })
  }, [others]);

  const { update } = useLocations((location) => {
    mutateMemberLocations(
      location.previousLocation?.nodeid,
      location.currentLocation.nodeid,
      location.member.clientId
    );
  });
  
  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Row ID", valueGetter: "node.id" },
    {
      field: "rowMembers",
      cellRenderer: (props) => {
        return (
          <>
            {props.value.length > 0 ? (
              <AvatarStack members={props.value} />
            ) : (
              <div>None</div>
            )}
          </>
        );
      },
    },
    { field: "make", filter: true },
    { field: "model", filter: true },
    { field: "price" },
  ]);

  const mutateMemberLocations = useCallback((prev,next,id) => {
    updateRowData((draft) => { 
      if (prev) {
        const rowIdx = draft.findIndex((r) => r.id === prev);
        const memberIdx = draft[rowIdx].rowMembers.indexOf(id);
        if (memberIdx > -1) {
          draft[rowIdx].rowMembers.splice(memberIdx, 1);
        }
      }
      if (next) {
        const rowIdx = draft.findIndex((r) => r.id === next);
        if (draft[rowIdx]) {
          if (!draft[rowIdx].rowMembers.includes(id)) {
            let l = draft[rowIdx].rowMembers.push(id);
          }
        }
      }

    });
  }, []);

  const onGridReady = (e) => {
    api = e.api;
    console.log(`Ready`);
  };

  const onRowSelected = async (e) => {
    if (e.node.isSelected()) {
      update({ nodeid: e.node.id });
    }
  };

  const getRowId = (params) => params.data.id;

  return (
    <>
      <div>{ client.auth.clientId }</div>
      <div className="ag-theme-alpine" style={{ height: 400, overflow: 'hidden'}}>
        <AgGridReact
          rowSelection="single"
          ref={gridRef}
          rowData={rowData}
          rowHeight={50}
          columnDefs={columnDefs}
          onRowSelected={onRowSelected}
          getRowId={getRowId}
          onGridReady={onGridReady}
        />
      </div>
    </>
  );
}

export default App;
