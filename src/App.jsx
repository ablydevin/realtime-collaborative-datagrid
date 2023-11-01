import { useEffect, useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import Spaces from "@ably/spaces";
import { useSpace, useMembers, useLocations } from "@ably/spaces/react";

import { useAbly } from "ably/react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

import "./App.css";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

function App() {
  let api = null;

  const client = useAbly();
  const { space } = useSpace();
  const { self, others } = useMembers();
  const { update } = useLocations((location)=>{
    console.log(location)
    updateMemberLocation(location.previousLocation?.nodeid, location.currentLocation.nodeid, location.member.clientId)
  });

  const gridRef = useRef();

  useEffect(() => {
    space?.enter({ clientID: client.auth.clientId });
  }, [space]);

  const [rowData, updateRowData] = useState([
    { id: "a", make: "Toyota", model: "Celica", price: 35000, rowMembers: [] },
    { id: "b", make: "Ford", model: "Mondeo", price: 32000, rowMembers: [] },
    { id: "c", make: "Porsche", model: "Boxter", price: 72000, rowMembers: [] },
  ]);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Row ID", valueGetter: "node.id" },
    {
      field: "rowMembers",
      cellRenderer: (props) => {
        return (
          <>
            {
            props.value.length
            //  > 0 ? (
            //   props.value.map((d) => (
            //     <span key={d}>{d.toUpperCase().substring(0, 1)},</span>
            //   ))
            // ) : (
            //   <p>None</p>
            // )
            }
            
          </>
        );
      },
    },
    { field: "make", filter: true },
    { field: "model", filter: true },
    { field: "price" },
  ]);

  const updateMemberLocation = (prev, next, id) => {

    //if there is a previous location, remove the clientid from it
    const removeMemberFromLocation = (location, clientId) => {
      console.log(`Remove from prior location`)

      // Clone the row data
      //const rowDataClone = [...rowData]      

      // Find the row index we want to update
      //const rowIdx = rowDataClone.findIndex((r) => r.id === location);
      const rowIdx = rowData.findIndex((r) => r.id === location);

      // Create a clone of the data row
      //const rowClone = { ...rowDataClone[rowIdx] }
      const row = rowData[rowIdx]

      // clone the members of the row index
      //const rowMembersClone = [... rowClone.rowMembers]
      const rowMembersClone = [...row.rowMembers]

      // find the index of the rowMember
      const memberIdx = rowMembersClone.indexOf(clientId);

      //If the index is >1 remove that member from the cloned array
      if (memberIdx > -1) {
        console.log(`Removing found member at row ${rowIdx} member ${memberIdx}`)
        console.log(rowMembersClone)
        rowMembersClone.splice(memberIdx, 1);
        console.log(rowMembersClone)

        // Assign the updated cloned member array
        //rowClone.rowMembers = rowMembersClone

        updateRowData(rowData => {
          const copy = [...rowData]
          copy[rowIdx].rowMembers = rowMembersClone
          return copy
        })
        // Update the rowdata state
        //rowDataClone[rowIdx] = rowClone;
        //console.log(rowDataClone[rowIdx].rowMembers)
        //updateRowData(rowDataClone)
      }

    };

    const addMemberToLocation = (location, clientId) => {
      console.log(`Add to location`)
      
      // Clone the row data
      const rowDataClone = [...rowData]      

      // Find the row index we want to update
      const rowIdx = rowDataClone.findIndex((r) => r.id === location);

      // Create a clone of the data row
      //const rowClone = { ...rowDataClone[rowIdx] }
      const row = rowData[rowIdx]

      // clone the members of the row index
      const rowMembersClone = [...row.rowMembers]

      if (!rowMembersClone.includes(clientId)) {
        console.log(`Adding member to row index ${rowIdx}`)
        console.log(rowMembersClone)
        //rowMembersClone = [...rowMembersClone, clientId];
        rowMembersClone.push(clientId);
        console.log(rowMembersClone)

        updateRowData(rowData => {
          const copy = [...rowData]
          copy[rowIdx].rowMembers = rowMembersClone
          //console.log(copy[rowIdx].rowMembers)
          return copy
        })
        // Assign the updated cloned member array
        //rowClone.rowMembers = rowMembersClone
  
        // Update the rowdata state
        //rowDataClone[rowIdx] = rowClone;
        //updateRowData(rowDataClone)
      }
    };
    
    if (prev) {
      removeMemberFromLocation(prev, id);
    }
    addMemberToLocation(next, id);

    //console.log(JSON.stringify(rowData))
    //console.log(api)

  };

  const changeValue = (e) => {


  }

  const onGridReady = (e) => {
    api = e.api;
    console.log(`Ready`)
    //console.log(api)
  };

  const onRowSelected = async (e) => {
    if (e.node.isSelected()) {
      update({ nodeid: e.node.id })
    }
  };

  const getRowId = (params) => params.data.id;

  return (
    <>
      <div>{client.auth.clientId}</div>
      <div>
        <AvatarGroup>
          {self && (
            <Avatar key={self.clientId}>
              {self.clientId.toUpperCase().charAt(0)}
            </Avatar>
          )}
          {others &&
            others.length > 0 &&
            others.map((m) => (
              <Avatar key={m.clientId}>
                {m.clientId.toUpperCase().charAt(0)}
              </Avatar>
            ))}
        </AvatarGroup>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          rowSelection="single"
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          onRowSelected={onRowSelected}
          getRowId={getRowId}
          onGridReady={onGridReady}
        />
      </div>
      <div>
        <ul>
          {/* {JSON.stringify(self)} */}
          {self && <li key={self.clientId}>{self.clientId}</li>}
          {others &&
            others.length > 0 &&
            others.map((m) => <li key={m.clientId}>{m.clientId}</li>)}
        </ul>
      </div>
      <button onClick={changeValue}>Change</button>
    </>
  );
}

export default App;
