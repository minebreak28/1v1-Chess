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
 * @param handleContinue function to handle when the exit to lobby button is clicked
 * @param handleClose function to handle when the close button is clicked
 */
export default function CustomDialog({ open, children, title, contentText, handleContinue, handleClose }) {
    return (
        <Dialog
            open={open}
        >
            {/* Dialog container */}
            <DialogTitle sx={{ textAlign: 'center' }}>{title}</DialogTitle>
            <DialogContent> {/* Main body of modal/dialog */}
                <DialogContentText> {/* Main text */}
                    {contentText}
                </DialogContentText>
                {children} {/* Other content */}
            </DialogContent>
            <DialogActions> {/* Dialog action buttons */}
                {/* Force users to make input without option to cancel */}
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleContinue}>Exit to Lobby</Button>
            </DialogActions>
        </Dialog>

    );
}