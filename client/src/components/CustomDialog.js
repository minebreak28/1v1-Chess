import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
/**
 * Reusable dialog modal
 * @param open is the modal rendered
 * @param children prop to get component childrens
 * @param title title of dialog modal
 * @param contentText message to be displayed
 * @param handleContinue function to handle when the continue button is clicked
 */
export default function CustomDialog({ open, children, title, contentText, handleContinue }) {
    return (
        <Dialog open={open}> {/*dialog container*/}
            <DialogTitle>{title}</DialogTitle>
            <DialogContent> {/* Main body of modal/dialog */}
                <DialogContentText> {/* main text */}
                    {contentText}
                </DialogContentText>
                {children} {/* Other content */}
            </DialogContent>
            <DialogActions> {/* Dialog action buttons */}
                {/* Force users to make input without option to cancel */}
                {/* <Button onClick={handleClose}>Cancel</Button> */}
                <Button onClick={handleContinue}>Continue</Button>
            </DialogActions>
        </Dialog>
    );
}