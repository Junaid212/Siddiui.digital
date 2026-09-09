import { writeFileSync, readFileSync } from 'fs';

const SIDEBAR_PATH = 'D:\\Bright Media WORK\\siddique-admin\\client\\src\\components\\Layout\\Sidebar.jsx';

export function patch() {
    let content = readFileSync(SIDEBAR_PATH, 'utf8');

    // Make sure HiOutlineBookOpen is imported from react-icons/hi
    if (content.includes('import {\n    HiOutlineChartBar,')) {
        content = content.replace(
            'import {\n    HiOutlineChartBar,',
            'import {\n    HiOutlineBookOpen,\n    HiOutlineChartBar,'
        );
        writeFileSync(SIDEBAR_PATH, content, 'utf8');
        return { success: true, message: 'Successfully added HiOutlineBookOpen to Sidebar.jsx imports' };
    }
    return { success: true, message: 'Import pattern already updated or not found' };
}
