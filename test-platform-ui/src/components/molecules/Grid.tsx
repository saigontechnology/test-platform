import { DataContext } from '@/libs/contextStore';
import { Box, Typography } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { useContext } from 'react';
import CustomGridPagination from './CustomGridPagination';

export const multipleLinesTypo = (content: string) => {
  return (
    <Typography className="overflow-hidden text-ellipsis whitespace-normal text-sm">
      {content}
    </Typography>
  );
};

interface ICustomGrid extends DataGridProps {
  height?: string;
}

export default function CustomGrid(props: ICustomGrid) {
  const { height } = props;
  const { data } = useContext(DataContext);

  return (
    <Box className={`${height} w-full overflow-y-auto`}>
      <DataGrid
        sx={{
          '.MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '.MuiDataGrid-cell': {
            fontSize: 14,
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
              page: data.pagination ? data.pagination.pageNum - 1 : 1,
            },
          },
          sorting: {
            // sortModel: [{ field: 'id', sort: 'desc' }],
          },
        }}
        slots={{
          pagination: CustomGridPagination,
          //toolbar: GridToolbar,
        }}
        slotProps={
          {
            // toolbar: {
            //   showQuickFilter: true,
            //   csvOptions: { disableToolbarButton: true },
            //   printOptions: { disableToolbarButton: true },
            // },
          }
        }
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        {...props}
      />
    </Box>
  );
}
