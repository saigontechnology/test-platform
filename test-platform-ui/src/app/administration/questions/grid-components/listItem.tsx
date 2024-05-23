import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import './styles.scss';

export default function ListCardItem(): React.ReactElement {
  return (
    <div className="list-card-item">
      <div className="question-title">
        <div className="title">Having clause in SQL</div>
        <div className="category">SQL</div>
      </div>
      <div className="tag-chip-container">
        <span className="tag-chip-item">Aggregation</span>
        <span className="tag-chip-item">Data Filtering</span>
        <span className="tag-chip-item">Data Manipulation</span>
        <span className="tag-chip-item">Database Management</span>
        <span className="tag-chip-item">Query Syntax</span>
      </div>
      <div className="question-description">
        <div>Question Gist</div>
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the standard dummy text ever since the
          1500s,
        </div>
      </div>
      <div className="question-info-container flex gap-4">
        <span className="question-info-chip">
          <TaskAltIcon fontSize="small" />
          Multiple Choice
        </span>
        <span className="question-info-chip">
          <StackedBarChartOutlinedIcon
            sx={{
              width: '16px',
              height: '16px',
            }}
          />
          Easy
        </span>
        <span className="question-info-chip">
          <AccessTimeIcon
            sx={{
              width: '16px',
              height: '16px',
            }}
          />
          30 min
        </span>
      </div>
    </div>
  );
}
