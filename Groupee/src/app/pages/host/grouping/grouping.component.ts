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

async generateReport() {
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
        const worksheet = workbook.addWorksheet(`Group ${group.name}`);

        // Merge cells for the title
        worksheet.mergeCells('A1:C3');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = `Group ${group.name} Information`;
        titleCell.font = { size: 20, bold: true, color: { argb: 'FFFFFFFF' }};
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        titleCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' },
        };

        // Adjust row heights
        worksheet.getRow(5).height = 25;

        // Manually set up columns
        const columns = ['Participant Name', 'Participant Email', 'Participant Phone'];

        // Set column widths
        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 30;

        // Add the header row at rowIndex = headerRowIndex
        const headerRowIndex = 5;
        const headerRow = worksheet.getRow(headerRowIndex);

        // Remove this line:
        // headerRow.values = columns;

        const columnsToFormat = [1, 2, 3]; // Columns 1 to 3
        columnsToFormat.forEach((colNumber) => {
          const cell = headerRow.getCell(colNumber);
          
          cell.value = columns[colNumber - 1]; // Set the header text
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

        // Add participants to the worksheet starting from rowIndex
        let rowIndex = headerRowIndex + 1;
        if (group.participants && Array.isArray(group.participants)) {
          for (const participant of group.participants) {
            const row = worksheet.getRow(rowIndex);

            // Assign participant data to specific cells
            row.getCell(1).value = participant.name;
            row.getCell(2).value = {
              text: participant.email,
              hyperlink: `mailto:${participant.email}`,
            };
            row.getCell(3).value = participant.phone;

            // Apply border and alignment to each cell in the row
            [1, 2, 3].forEach((colNumber) => {
              const cell = row.getCell(colNumber);
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              };
              cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });

            row.height = 25; // Adjust row height if needed
            rowIndex++;
          }
        }

        // Add auto-filter to the header row
        worksheet.autoFilter = {
          from: {
            row: headerRowIndex,
            column: 1,
          },
          to: {
            row: headerRowIndex,
            column: columnsToFormat.length,
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