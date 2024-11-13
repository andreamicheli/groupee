import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessario per le direttive *ngFor e *ngIf
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore (assicurati che la versione corrisponda alla tua configurazione)
import { ActivatedRoute, Router } from '@angular/router';
import { Participant, Group } from '../../../models/room.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import * as logoFile from 'src/assets/images/bozzalogo_ver2.png';
import * as ExcelJS from 'exceljs';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ButtonComponent } from '../../../components/button/button.component';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';


@Component({
  selector: 'app-grouping',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ButtonComponent],
  templateUrl: './grouping.component.html',
  styleUrls: ['./grouping.component.css'],
})
export class HostGroupingComponent implements OnInit {
  @HostBinding('class') className = 'w-full flex justify-center';

  roomId: string = "";
  groups: Group[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private http: HttpClient,
    public model: PlatformModelService,
    private router: Router
  ) { }

  ngOnInit() {
    // Ottieni roomId dai parametri della route
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    this.fetchGroups();
  }

  fetchGroups() {
    this.firestore.collection('rooms').doc(this.roomId)
      .collection<Group>('groups')
      .snapshotChanges()
      .subscribe(groupSnapshots => {
        this.groups = groupSnapshots.map(snap => {
          const { id, ...data } = snap.payload.doc.data() as Group;
          return { id, ...data };
        });
        this.isLoading = false;
      }, error => {
        console.error('Errore nel recupero dei gruppi:', error);
        this.errorMessage = 'Si è verificato un errore durante il recupero dei gruppi.';
        this.isLoading = false;
      });
  }

  generateReport() {
    this.isLoading = true;
    this.firestore.collection('rooms').doc(this.roomId)
      .collection<Group>('groups')
      .snapshotChanges()
      .subscribe(async groupSnapshots => {
        // Map over group snapshots to extract data and IDs
        const groups = groupSnapshots.map(snap => {
          const groupId = snap.payload.doc.id;
          const groupData = snap.payload.doc.data() as Group;
          const { id, ...rest } = groupData;
          return { id: groupId, ...rest };
        });
  
        // Create a new workbook
        const workbook = new Workbook();
  
        const logoBlob = await firstValueFrom(
          this.http.get('assets/images/bozzalogo_ver2.png', { responseType: 'blob' })
        );
    
        // Convert the Blob to Base64
        const base64Image = await this.convertBlobToBase64(logoBlob);
    
        // Remove the data URL prefix to get only the base64 string
        const base64Data = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    
    
        // Add a logo to the workbook
        const logo = workbook.addImage({
          base64: base64Data,
          extension: 'png',
        });
  
        // For each group, create a separate worksheet
        for (const group of groups) {
          const worksheet = workbook.addWorksheet(`Group ${group.id}`);
  
          // Add the logo to the worksheet
          worksheet.addImage(logo, {
            tl: { col: 0, row: 0 },
            ext: { width: 150, height: 80 },
          });
  
          // Merge cells for the title
          worksheet.mergeCells('D1:F3');
          const titleCell = worksheet.getCell('D1');
          titleCell.value = `Group ${group.id} Report`;
          titleCell.font = { size: 20, bold: true };
          titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  
          // Adjust row heights
          worksheet.getRow(1).height = 80;
  
          // Define columns starting from row 4
          worksheet.columns = [
            { header: 'Participant Name', key: 'name', width: 25 },
            { header: 'Participant Email', key: 'email', width: 30 },
            { header: 'Participant Phone', key: 'phone', width: 20 },
          ] as ExcelJS.Column[];
  
          // Add the header row at row 4
          const headerRowIndex = 4;
          const headerRow = worksheet.getRow(headerRowIndex);
          headerRow.values = worksheet.columns.map(col => col.header).filter(header => header !== undefined) as string[];
  
          // Apply styling to header row
          headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF4F81BD' },
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
  
          // Add participants to the worksheet starting from row 5
          let rowIndex = headerRowIndex + 1;
          if (group.participants && Array.isArray(group.participants)) {
            for (const participant of group.participants) {
              const row = worksheet.addRow({
                name: participant.name,
                email: { text: participant.email, hyperlink: `mailto:${participant.email}` },
                phone: participant.phone,
              });
  
              // Apply border and alignment to each cell in the row
              row.eachCell((cell) => {
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' },
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
              });
  
              row.height = 20; // Adjust row height if needed
              rowIndex++;
            }
          }
  
          // Auto-fit columns based on the content
          worksheet.columns.forEach((column) => {
            let maxLength = 0;
            const excelColumn = column as ExcelJS.Column; // Type assertion
            excelColumn.eachCell({ includeEmpty: true }, (cell) => {
              const columnLength = cell.value ? cell.value.toString().length : 10;
              if (columnLength > maxLength) {
                maxLength = columnLength;
              }
            });
            excelColumn.width = maxLength < 20 ? 20 : maxLength + 2;
          });
  
          // Add auto-filter to the header row
          worksheet.autoFilter = {
            from: {
              row: headerRowIndex,
              column: 1,
            },
            to: {
              row: headerRowIndex,
              column: worksheet.columns.length,
            },
          };
  
          // Freeze the header row
          worksheet.views = [
            { state: 'frozen', ySplit: headerRowIndex },
          ];
        }
  
        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();
  
        // Save the file
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, 'GroupReport.xlsx');
  
        this.isLoading = false;
      }, error => {
        console.error('Error fetching groups:', error);
        this.isLoading = false;
      });
  }

  // Helper function to convert Blob to Base64
private convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
}

toTree() {
  this.router.navigate([`host/${this.model.session.roomId()}/tree`]);
}
  

}