/* eslint-disable @next/next/no-async-client-component */
'use client';

import DataTable from "@/app/components/molecules/Grid";
import { questionRows } from "@/app/constants/questions";
import { Divider, Typography } from "@mui/material";
import { columns } from "../page";

export default function ArchivedQuestions() {
    return (
        <>
            <Typography component="h1" className={`text-xl md:text-2xl`}>
                Archived Questions
            </Typography>
            <Divider className="my-10" />
            <DataTable rows={questionRows} columns={columns}/>
        </>
    )   
}