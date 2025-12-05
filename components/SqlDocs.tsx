
import React, { useState } from 'react';
import { Database, Copy, FileCheck, Table, GitMerge } from 'lucide-react';

export const SqlDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'schema' | 'logic'>('schema');

  const analysisDoc = `
  # 数据库设计更新说明 (v3.0)

  系统已进行核心业务逻辑简化，**移除每日工时申报**，转为**岗位定额工作量自动分配**模式。

  ### 1. 核心设计变更点
  *   **移除 \`WorkLog\` 表**: 
      *   学生无需每日填报工时。
      *   工作量 (\`workload\`) 直接与岗位 (\`Position\`) 挂钩。
      *   学生一旦被岗位录取，系统自动生成对应的年度工作量记录。
  *   **新增 \`ScholarshipRecords\` 表**:
      *   用于独立记录奖学金发放流水（应发、补发、扣发）。
  *   **工作量计算逻辑**:
      *   Total Workload = Position.StandardWorkload (Fixed)。
      *   无需审核员每日审批，减少管理成本。

  ### 2. 实体关系图 (ER) 概览
  *   **岗位层**: \`Positions\` (包含 \`workload\` 字段)
  *   **业务层**: 
      *   \`Students\` -> \`Applications\` (Approved) -> 自动关联工作量
      *   \`Students\` <- \`ScholarshipRecords\` (发放明细)
  `;

  const schemaSql = `
  -- =============================================
  -- 1. 系统基础表
  -- =============================================

  -- 1.1 博士生表
  CREATE TABLE students (
      student_id INT AUTO_INCREMENT PRIMARY KEY,
      student_no VARCHAR(32) UNIQUE NOT NULL,
      name VARCHAR(80) NOT NULL,
      status ENUM('enrolled','suspended','graduated') DEFAULT 'enrolled',
      has_job TINYINT(1) DEFAULT 0 COMMENT '是否已有岗位',
      verified TINYINT(1) DEFAULT 0 COMMENT '身份是否核验'
  );

  -- 1.2 岗位表 (Updated)
  CREATE TABLE positions (
      position_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      type ENUM('TA','RA','OTHER') NOT NULL,
      total_slots INT NOT NULL,
      salary_month DECIMAL(10,2) DEFAULT 0,
      workload INT DEFAULT 0 COMMENT '标准定额工作量 (Fixed)',
      status ENUM('open','closed','completed') DEFAULT 'open'
  );

  -- =============================================
  -- 2. 业务流程表
  -- =============================================

  -- 2.1 岗位申请表
  CREATE TABLE applications (
      application_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      position_id INT,
      apply_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      status ENUM('pending','approved','rejected') DEFAULT 'pending',
      FOREIGN KEY (student_id) REFERENCES students(student_id),
      FOREIGN KEY (position_id) REFERENCES positions(position_id)
  );

  -- 2.2 年度工作量统计表 (Simplified)
  -- 不再聚合每日记录，而是直接存储岗位对应的定额
  CREATE TABLE workloads (
      workload_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      position_id INT,
      year_start DATE,
      year_end DATE,
      total_hours INT COMMENT '直接取自 positions.workload',
      status ENUM('正常','异常') DEFAULT '正常',
      FOREIGN KEY (student_id) REFERENCES students(student_id)
  );

  -- 2.3 奖学金发放记录表 (New)
  CREATE TABLE scholarship_records (
      record_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      amount DECIMAL(10,2) NOT NULL,
      issue_date DATE NOT NULL,
      type ENUM('应发','补发','扣发') DEFAULT '应发',
      reason VARCHAR(255),
      FOREIGN KEY (student_id) REFERENCES students(student_id)
  );
  `;

  const logicSql = `
  -- 存储过程：审批申请并自动生成工作量
  
  DELIMITER //
  CREATE PROCEDURE ApproveAndAssignWorkload(IN p_app_id INT)
  BEGIN
      DECLARE v_student_id INT;
      DECLARE v_position_id INT;
      DECLARE v_workload INT;
      
      -- 1. 获取申请及岗位定额
      SELECT a.student_id, a.position_id, p.workload 
      INTO v_student_id, v_position_id, v_workload
      FROM applications a
      JOIN positions p ON a.position_id = p.position_id
      WHERE a.application_id = p_app_id;

      -- 2. 更新申请状态
      UPDATE applications SET status = 'approved' WHERE application_id = p_app_id;

      -- 3. 更新学生状态
      UPDATE students SET has_job = 1 WHERE student_id = v_student_id;

      -- 4. 自动创建工作量记录 (直接赋值定额)
      INSERT INTO workloads (student_id, position_id, year_start, year_end, total_hours, status)
      VALUES (
          v_student_id, 
          v_position_id, 
          CONCAT(YEAR(NOW()), '-09-01'), -- 学年开始
          CONCAT(YEAR(NOW())+1, '-07-15'), -- 学年结束
          v_workload, -- 直接使用岗位定额
          '正常'
      );
  END //
  DELIMITER ;
  `;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden animate-fade-in" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-accent" />
            系统设计与 SQL 文档
          </h2>
          <p className="text-xs text-slate-500 mt-1">Version 3.0: 移除每日申报，实行定额工作量自动分配</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1 rounded-lg overflow-x-auto shadow-sm">
          <button onClick={() => setActiveTab('analysis')} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
            <FileCheck className="w-3.5 h-3.5" /> 变更分析
          </button>
          <button onClick={() => setActiveTab('schema')} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'schema' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
            <Table className="w-3.5 h-3.5" /> 最新表结构
          </button>
          <button onClick={() => setActiveTab('logic')} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'logic' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
            <GitMerge className="w-3.5 h-3.5" /> 自动逻辑
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-slate-900 flex flex-col">
          <div className="bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              {activeTab === 'schema' ? 'schema_v3.sql' : activeTab === 'logic' ? 'auto_assign.sql' : 'analysis_v3.md'}
            </span>
            <button className="text-slate-400 hover:text-white transition-colors" title="Copy Code">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 overflow-auto font-mono text-xs md:text-sm text-slate-300 flex-1 custom-scrollbar">
             {activeTab === 'analysis' && (
               <div className="whitespace-pre-wrap font-sans text-slate-300 prose prose-invert prose-sm max-w-none">
                 {analysisDoc}
               </div>
             )}
             {activeTab === 'schema' && <pre>{schemaSql}</pre>}
             {activeTab === 'logic' && <pre>{logicSql}</pre>}
          </div>
      </div>
    </div>
  );
};
