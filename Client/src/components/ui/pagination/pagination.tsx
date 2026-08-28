import { Pagination } from "@mui/material";
import "../../../style/ui.css"

export interface PaginateProps{
    currentPage:number
    setCurrentPage: (page:number) => void
    totalItems: number;
    itemsPerPage?: number;
    offset?:number
    pageCount:number
}

export const PaginationComponent = ({
    currentPage,
    setCurrentPage,
    pageCount
}: PaginateProps) => {

    if (pageCount <= 1) return null
    
    return(
        <>
        {pageCount > 1 && (
            <div className="pagination-wrapper">
                
    
                <Pagination
                    count={pageCount}
                    page={currentPage + 1} 
                    onChange={(_event, page) => setCurrentPage(page - 1)}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </div>
        )}
        </>
    
        
    )
}

