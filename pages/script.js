document.getElementById('scrapeButton').addEventListener('click', async () => {
    // Mostrar o overlay de carregamento
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        const response = await fetch('https://newupd.onrender.com/scrape');
        const data = await response.json();

        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = ''; // Limpar tabela antes de preencher

        data.processos.forEach((processo) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td contenteditable="true">${processo.titulo}</td>
                <td contenteditable="true">${processo.descricao}</td>
                <td contenteditable="true">${processo.periodo}</td>
                <td contenteditable="true">${processo.url}</td>
                <td contenteditable="true">${processo.edital}</td>
                <td><button class="btn-remove btn btn-link">Remover</button></td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById('updateButton').disabled = false; // Habilitar botão de atualização
    } catch (error) {
        console.error('Erro ao realizar o scraping:', error);
    } finally {
        // Ocultar o overlay de carregamento
        document.getElementById('loadingOverlay').style.display = 'none';
    }
});

// Adiciona event listener para o botão de remover
document.querySelector('#dataTable').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-remove')) {
        event.target.closest('tr').remove();
    }
});

document.getElementById('updateButton').addEventListener('click', async () => {
    // Mostrar o overlay de carregamento
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        const rows = document.querySelectorAll('#dataTable tbody tr');
        const processosAtualizados = Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            return {
                titulo: cells[0].innerText.trim(),
                descricao: cells[1].innerText.trim(),
                periodo: cells[2].innerText.trim(),
                url: cells[3].innerText.trim(),
                edital: cells[4].innerText.trim()
            };
        });

        const response = await fetch('https://newupd.onrender.com/atualizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ processosAtualizados })
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar os dados');
        }

        const message = await response.text();
        alert(message);
    } catch (error) {
        console.error('Erro ao atualizar os dados:', error);
    } finally {
        // Ocultar o overlay de carregamento
        document.getElementById('loadingOverlay').style.display = 'none';
    }
});

document.getElementById('showUpdatedDataButton').addEventListener('click', async () => {
    // Mostrar o overlay de carregamento
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        const response = await fetch('https://newupd.onrender.com/processosAbertos');
        const data = await response.json();

        const tableBody = document.querySelector('#updatedDataTable tbody');
        tableBody.innerHTML = ''; // Limpar tabela antes de preencher

        data.forEach((processo) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${processo.titulo}</td>
                <td>${processo.descricao}</td>
                <td>${processo.periodo}</td>
                <td><a href="${processo.url}" target="_blank">${processo.url}</a></td>
                <td><a href="${processo.edital}" target="_blank">${processo.edital}</a></td>
                <td></td> <!-- Adiciona uma coluna vazia para manter o alinhamento com a tabela de dados do scraping -->
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao exibir dados atualizados:', error);
    } finally {
        // Ocultar o overlay de carregamento
        document.getElementById('loadingOverlay').style.display = 'none';
    }
});
