import { Box, Typography } from '@mui/material';
import { DataGrid, DataGridProps, GridToolbar } from '@mui/x-data-grid';
import CustomGridPagination from './CustomGridPagination';

export const multipleLinesTypo = (content: string) => {
  return (
    <Typography className="overflow-hidden text-ellipsis whitespace-normal">
      {content}
    </Typography>
  );
};

export default function CustomGrid(props: DataGridProps) {
  return (
    <Box className="h-[60vh] w-full overflow-y-auto">
      <DataGrid
        sx={{
          '.MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: 'id', sort: 'desc' }],
          },
        }}
        slots={{
          pagination: CustomGridPagination,
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
          },
        }}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        {...props}
      />
    </Box>
  );
}
