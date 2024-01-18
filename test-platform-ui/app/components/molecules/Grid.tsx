import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Chip, Typography } from '@mui/material';

export const multipleLinesTypo = (content: string) => {
    return <Typography className="whitespace-normal">{content}</Typography>
}

interface IDataTable {
    rows: any[],
    columns: GridColDef[]
}

export default function DataTable(props: IDataTable) {
    const { rows, columns } = props;
    return (
        <div style={{ height: '39rem', width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                rowHeight={170}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 3 },
                    }
                }}
                pageSizeOptions={[3, 5, 10]}
                checkboxSelection
            />
        </div>
    );
}
