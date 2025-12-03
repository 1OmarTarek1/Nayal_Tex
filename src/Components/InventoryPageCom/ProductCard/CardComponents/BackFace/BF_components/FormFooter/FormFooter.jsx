import './FormFooter.css'

const FormFooter = ({ handleCancel, onSave }) => {
    return (
        <footer className="formFooter">
            <button className="fromBtn cancelBtn" onClick={handleCancel}>الغاء</button>
            <button className="fromBtn saveBtn" onClick={onSave}>حفظ</button>
        </footer>
    )
}

export default FormFooter