<?php 
//sleep(7);
/**
{
            case 101:
            case 102:
            case 103:
                label = "已经上传";
                break;
            case 116:
                label = "格式不对";
                break;
            case 99:
                label = "系统错误";
                break;
            case 104:
            case 105:
                label = "空间不足";
                break;
            case 415:
                label = "解析失败";
                break;
            default:
                label = "上传失败";
        }

*/

echo $_GET['callback'].'('.'{"status":99}'.')';
?>
