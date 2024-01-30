import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export const multipleLinesTypo = (content: string) => {
  return <Typography className="whitespace-normal">{content}</Typography>;
};

interface IDataTable {
  rows: any[];
  columns: GridColDef[];
}

export default function DataTable(props: IDataTable) {
  const { rows, columns } = props;
  return (
    <Box
      className="h=[39rem] w-full"
      sx={{
        '.MuiDataGrid-cell, .MuiDataGrid-columnHeader': {
          outline: 'none !important',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={170}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 3 },
          },
        }}
        pageSizeOptions={[3, 5, 10]}
        checkboxSelection
      />
    </Box>
  );
}
