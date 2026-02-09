const fs = require('fs');
const path = require('path');

/**
 * Report Manager
 * Gerencia a geração e organização dos relatórios de testes
 */
class ReportManager {
  constructor() {
    this.reportsDir = path.join(__dirname, '../reports');
    this.htmlReportsDir = path.join(this.reportsDir, 'html-reports');
    this.screenshotsDir = path.join(this.reportsDir, 'screenshots');
  }

  /**
   * Cria estrutura de diretórios para relatórios
   */
  createReportDirectories() {
    const directories = [this.reportsDir, this.htmlReportsDir, this.screenshotsDir];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Diretório criado: ${dir}`);
      }
    });
  }

  /**
   * Limpa relatórios antigos
   */
  cleanOldReports() {
    if (fs.existsSync(this.htmlReportsDir)) {
      const files = fs.readdirSync(this.htmlReportsDir);
      files.forEach(file => {
        const filePath = path.join(this.htmlReportsDir, file);
        fs.unlinkSync(filePath);
      });
      console.log('🧹 Relatórios antigos removidos');
    }

    if (fs.existsSync(this.screenshotsDir)) {
      const files = fs.readdirSync(this.screenshotsDir);
      files.forEach(file => {
        const filePath = path.join(this.screenshotsDir, file);
        fs.unlinkSync(filePath);
      });
      console.log('🧹 Screenshots antigos removidos');
    }
  }

  /**
   * Gera relatório consolidado
   */
  generateConsolidatedReport() {
    console.log('📊 Gerando relatório consolidado...');
    this.createReportDirectories();

    const reportPath = path.join(this.htmlReportsDir, 'report.html');
    if (fs.existsSync(reportPath)) {
      console.log(`✅ Relatório disponível em: ${reportPath}`);
    }
  }

  /**
   * Obtém estatísticas dos testes
   */
  getTestStats() {
    // Esta função pode ser expandida para ler arquivos de resultado
    // e gerar estatísticas personalizadas
    return {
      timestamp: new Date().toISOString(),
      reportsDir: this.htmlReportsDir,
    };
  }
}

// Execução principal
if (require.main === module) {
  const manager = new ReportManager();
  manager.createReportDirectories();
  manager.generateConsolidatedReport();
}

module.exports = ReportManager;
